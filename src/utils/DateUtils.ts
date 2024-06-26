const toStringDate = (date: Date | string) => {
    if (typeof date === 'string') {
        date = new Date(date)
    }
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `${month}/${day}/${year}`
};

export default toStringDate;
