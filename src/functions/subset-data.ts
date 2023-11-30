const subsetData = (data: {[key: string]: any}[], vars: string[]) => {
    const out = data.map(d => vars.reduce((result: {[key: string]: any}, key: string) => {
        result[key] = d[key];
        return result;
      }, {}));
    return out
}

export default subsetData;