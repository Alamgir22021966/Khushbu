export class Resume {
    EID:string;
    FullName: string;
    FatherName: string;
    MotherName: string;
    PresentAddress: string;
    PermanentAddress: string;
    ContactNo: number;
    Email: string;
    DOB: Date;
    Nationality: string;
    NationalID: string;
    SocialProfile: string;
    Experiences: Experience[] = [];
    Educations: Education[] = [];
    OtherDetails: string;
    ProfilePic: string;
    Skills: Skill[] = [];
    constructor() {
        this.Experiences.push(new Experience());
        this.Educations.push(new Education());
        this.Skills.push(new Skill());
    }
}
export class Experience {
    Employer: string;
    JobTitle: string;
    JobDescription: string;
    startDate: string;
    Experience: number;
}
export class Education {
    Degree: string;
    Institute: string;
    Subject: string;
    PassingYear: string;
    Grade: string;
    Percentage: number;
}
export class Skill {
    Skill: string;
}
