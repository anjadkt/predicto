
export const utcToIst = (utcDate: string) => {
    const date = new Date(utcDate);
    return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

export const formatDate = (date: string) => {
    const istDate = utcToIst(date);
    return istDate.split(",")[0];
}

export const formatTime = (date: string) => {
    const istDate = utcToIst(date);
    return istDate.split(",")[1].trim().replace(/:\d{2}(?=\s*(AM|PM))/i, "").toUpperCase();
}

export const formatIsoDate = (date: Date) => {
    return date.toISOString().split("T")[0];
};
