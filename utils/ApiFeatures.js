class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Basic Filtering
    let newParams = {...this.queryString};
    const excludedParams = ['page', 'sort', 'limit', 'fields'];
    excludedParams.forEach(cur => delete newParams[cur]);

    // 1B) Advanced Filtering
    // {difficulty: 'easy', duration: {$gte: 5}}
    let paramString = JSON.stringify(newParams);
    paramString = paramString.replace(/\b(gte|gt|lt|lte)\b/ig, i => `$${i}`)
    newParams = JSON.parse(paramString);
    this.query = this.query.find(newParams)
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt')
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;
    const skip = (page-1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures
