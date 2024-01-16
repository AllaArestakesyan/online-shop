export interface LoginDTO { 
    email:string,
    password:string
}
export interface RegisterDTO { 
    name:string;
    username:string;
    email:string;
    password:string;
    role:number;
    emailToken:string;
    isVerified:number
    phone_number:string
}

export interface VerificationDto{
    email:string;
    token:string;
}