export interface Category {
    // idx?: number;
    cat_Code: string;
    cat_Name: string;
    CreatedUser:string;
    
  }

  export interface ApiResponse<T> {
    isSuccess: boolean;
    data?: T;
    message?: string;
    statusCode?: number;
  }

  