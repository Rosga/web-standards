const closeWatcherStack = [];

window.CloseWatcher = window.CloseWatcher || class CloseWatcher extends EventTarget {
  #isActive = true;
  #firingCancelEvent = false;
  #oncancelHandler = null;
  #oncloseHandler = null;

  constructor({ signal } = {}) {
    super();
    // We can't do the user activation checking. So sometimes in the real CloseWatcher,
    // it would be grouped with previous watchers, but we don't.
    
    if (signal) {
      if (signal.aborted) {
        this.#isActive = false;
        return;
      }
      signal.addEventListener("abort", () => this.#deactivate());
    }

    closeWatcherStack.push(this);
  }

  destroy() {
    this.#deactivate();
  }
  
  close() {
    if (!this.#isActive || !document.defaultView) {
      return;
    }

    this.dispatchEvent(new Event("close"));
    
    this.#deactivate();
  }

  requestClose() {
    if (!this.#isActive) {
      return;
    }
    if (this.#firingCancelEvent) {
      return;
    }

    // We can't do the user activation checking. So sometimes in the real CloseWatcher, the cancel
    // event would get skipped, but in the polyfill, we always fire it.

    this.#firingCancelEvent = true;
    const shouldContinue = this.dispatchEvent(new Event("cancel", { cancelable: true }));
    this.#firingCancelEvent = false;
    if (!shouldContinue) {
      return;
    }

    if (this.#isActive && document.defaultView) {
      this.dispatchEvent(new Event("close"));
    }
    this.#deactivate();
  }

  #deactivate() {
    this.#isActive = false;

    // Might not be the top of the stack if we're using destroy().
    const index = closeWatcherStack.indexOf(this);
    if (index !== -1) {
      closeWatcherStack.splice(index, 1);
    }
  }

  get oncancel() {
    return this.#oncancelHandler;
  }
  set oncancel(handler) {
    if (handler !== this.#oncancelHandler || handler === null) {
      this.removeEventListener("cancel", this.#oncancelHandler);
      this.#oncancelHandler = null;
      return;
    }

    this.#oncancelHandler = handler;
    this.addEventListener("cancel", this.#oncancelHandler);
  }

  get onclose() {
    return this.#oncancelHandler;
  }
  set onclose(handler) {
    if (handler !== this.#oncloseHandler || handler === null) {
      this.removeEventListener("close", this.#oncloseHandler);
      this.#oncloseHandler = null;
      return;
    }

    this.#oncloseHandler = handler;
    this.addEventListener("close", this.#oncloseHandler);
  }
};

// We only listen for Escape keydowns as close signals. The polyfill doesn't listen for anything
// else, like Android back button presses.
document.addEventListener("keydown", e => {
  if (!e.isTrusted) {
    // Not an actual user-triggered keydown.
    return;
  }

  if (e.key !== "Escape") {
    return;
  }

  const closeWatcher = closeWatcherStack.at(-1);
  if (!closeWatcher) {
    return;
  }

  // Make sure all other listeners go first. Unfortunately the only way I can think of to do that is
  // to queue a task. (queueMicrotask() won't work because the microtask queue is emptied in between
  // each event listener, for browser-triggered events).
  setTimeout(() => {
    if (e.defaultPrevented) { 
      // Don't deliver to the CloseWatcher; some other listener canceled the event.
      return;
    }

    closeWatcher.requestClose();
  }, 0);
});
