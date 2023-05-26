export const formatJson = (data: Buffer) => {
    if(data) {
        return JSON.parse(data.toString());
    }
}