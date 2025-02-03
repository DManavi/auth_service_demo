import { DefaultValuePipe, ParseIntPipe, Query } from '@nestjs/common';

export type PaginationRequest = {
  /**
   * Current page number (1-based)
   */
  pageNumber: number;

  /**
   * Number of items per page
   */
  pageSize: number;
};

export type PaginationResponse = {
  /**
   * Total number of items
   */
  totalItems: number;

  /**
   * Total number of pages
   */
  totalPages: number;
};

/**
 * Get skip and take values for pagination
 */
export const getSkipTake = ({
  pageNumber,
  pageSize,
}: PaginationRequest): { skip: number; take: number } => ({
  skip: (pageNumber - 1) * pageSize,
  take: pageSize,
});

/**
 * Get pagination response
 */
export const getPaginationResponse = ({
  totalItems,
  pageSize,
}: {
  totalItems: number;
  pageSize: number;
}): PaginationResponse => ({
  totalItems,
  totalPages: Math.ceil(totalItems / pageSize),
});

export const PageSizeQueryParam = () =>
  Query('page_size', new DefaultValuePipe(10), new ParseIntPipe());

export const PageNumberQueryParam = () =>
  Query('page_number', new DefaultValuePipe(1), new ParseIntPipe());
