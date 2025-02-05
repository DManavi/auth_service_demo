class Clock {
  currentDate(): Date {
    return new Date();
  }

  /**
   * Get the current time in milliseconds.
   */
  currentTimestamp(): number {
    return Date.now().valueOf();
  }
}

export { Clock as Provider };
