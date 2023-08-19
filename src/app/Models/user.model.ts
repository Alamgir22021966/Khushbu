
export class Login {
    FirstName: string;
    Password: string;
    ROLE: string;
    UID: string;
}

export class UserModel {
    UID: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
    ConfirmPassword: string;

}

export class UserModelNew {
    UID: string;
    FULLNAME: string;
    TITLE: string;
    JOBTITLE: string;
    STARTDATE?: Date;
}