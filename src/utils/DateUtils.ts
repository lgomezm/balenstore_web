const toStringDate = (date: Date | string) => {
    if (typeof date === 'string') {
        date = new Date(date)
    }
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
};

export default toStringDate;
