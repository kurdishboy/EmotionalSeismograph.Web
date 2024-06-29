export interface ApiResult<TResult> {
  result: TResult;
  errors: string[];
  statua: number;
}
