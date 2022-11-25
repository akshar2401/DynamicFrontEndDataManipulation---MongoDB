export interface IPagination {
  skip: number;
  take: number;
}

export class PageBasedPagination implements IPagination {
  constructor(public readonly page = 1, public readonly take = 0) {
    this.page = Math.max(this.page, 1);
    this.take = Math.max(this.take, 0);
  }

  get skip() {
    return (this.page - 1) * this.take;
  }
  toString() {
    return JSON.stringify(
      {
        page: this.page,
        take: this.take,
        skip: this.skip,
      },
      null,
      2
    );
  }
}

export class Pagination implements IPagination {
  constructor(public readonly skip = 0, public readonly take = 0) {}

  toString() {
    return JSON.stringify(
      {
        skip: this.skip,
        take: this.take,
      },
      null,
      2
    );
  }
}
