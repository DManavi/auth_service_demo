import { PaginationResponse } from './pagination';

type FailureStatus = {
  /**
   * Operation failed
   */
  success: false;

  /**
   * Error message
   */
  error: string;

  /**
   * Error code
   */
  code: string;
};

type SuccessStatus = {
  /**
   * Operation was successful
   */
  success: true;
};

type Status = FailureStatus | SuccessStatus;

type NoOutput = {};
type WithOutput<T> = {
  data: T;
};

type Output<T = void> = T extends void ? NoOutput : WithOutput<T>;

export type Response<T = void> = Status & Output<T>;

export type FailedResponse = FailureStatus & Output<void>;
export type SuccessfulResponse<T = void> = SuccessStatus & Output<T>;

export type PaginatedResponse<T> = SuccessfulResponse<Array<T>> & {
  /**
   * Pagination information
   */
  pagination: PaginationResponse;
};
