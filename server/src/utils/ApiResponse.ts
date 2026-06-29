class ApiResponse {

    success: boolean;
    message: string;
    response?: any;
    ok?: boolean;

    constructor(
        message: string,
        data: any
    ) {
        this.success = true;
        this.ok = true;
        this.message = message;
        this.response = data;
    }
}

export default ApiResponse;