import { Education, Experience, Resume, Skill } from '@/Models/resume.model';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfmakeService } from '@services/PDFMake/pdfmake.service';
import { ResumeService } from '@services/resume.service';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {

  @ViewChild(BsDatepickerDirective) datepicker: BsDatepickerDirective;
  @ViewChild('autofocus') myfield: ElementRef;
  datePickerConfig: Partial<BsDatepickerConfig>;
  resume = new Resume();
  //degrees = ['B.A', 'B.Sc.', 'B.Com', 'M.A', 'M.Sc', 'M.Com'];
  submitted = false;
  ResumeForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private pdfService: PdfmakeService,
    private interactivityChecker: InteractivityChecker,
    private resumeService: ResumeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.CreateResumeForm();

    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY',
      todayHighlight: true
    });
  }

  public Degrees = [
    { id: 0, degree: '' },
    { id: 1, degree: 'M.Sc' },
    { id: 2, degree: 'M.A' },
    { id: 3, degree: 'M.Com' },
    { id: 4, degree: 'B.Sc(hons)' },
    { id: 5, degree: 'B.A(hons)' },
    { id: 6, degree: 'B.Com(Hons)' },
    { id: 7, degree: 'B.Sc' },
    { id: 8, degree: 'B.A' },
    { id: 9, degree: 'B.Com' },
    { id: 10, degree: 'H.S.C' },
    { id: 11, degree: 'S.S.C' },
  ];

  get Degree() {
    return this.ResumeForm.controls['Educations'].get('Degree');
  }

  changeDegree(e) {
    this.Degree.setValue(e.target.value, {
      onlySelf: true
    })
  }

  CreateResumeForm() {

    let Edu = [];
    for (let i = 0; i < 4; i++) {
      Edu.push(this.Education())

    }
    let Exp = [];
    for (let i = 0; i < 4; i++) {
      Exp.push(this.Experience())

    }
    let Sk = [];
    for (let i = 0; i < 1; i++) {
      Sk.push(this.Skill())

    }

    /* Main form group*/

    this.ResumeForm = this.fb.group({
      PersonalDetails: this.fb.group({
        EID: ['', [Validators.required, Validators.minLength(3)]],
        FullName: ['', Validators.required],
        FatherName: [''],
        MotherName: [''],
        PresentAddress: [''],
        PermanentAddress: [''],
        ContactNo: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]],
        DOB: [''],
        Nationality: [''],
        NationalID: [''],
        Email: [''],
        SocialProfile: [''],
        OtherDetails: [''],
        ProfilePic: [''],
        FILENAME: [''],
      }),

      Educations: this.fb.array(Edu) as FormArray,
      Experiences: this.fb.array(Exp) as FormArray,
      Skills: this.fb.array(Sk) as FormArray,

    });

  }

  ngOnInit(): void {
  }

  @HostListener('window:scroll') onScrollEvent() {
    this.datepicker.hide();
  }

  setFocus(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      this[id].nativeElement.focus();
    }
  }

  @HostListener('window:keyup', ['$event']) keyevent(event: any) {
    event.preventDefault();
    const inputs = Array.prototype.slice.call(document.querySelectorAll('input, textarea'));
    // const inputs = Array.prototype.slice.call(document.querySelectorAll('input'));
    const controls = [];
    if (Array.isArray(controls) && !controls.length) {
      for (let i = 0; i < inputs.length; i++) {
        if (this.interactivityChecker.isFocusable(inputs[i])) {
          controls.push(inputs[i]);
        }
      }
    }

    if (event.keyCode === 13 || event.keyCode === 40) {
      const control = controls[controls.indexOf(document.activeElement) + 1];
      if (control) {
        control.focus();
        control.select();
      }
    } else if (event.keyCode === 38) {
      const control = controls[controls.indexOf(document.activeElement) - 1];
      if (control) {
        control.focus();
        control.select();
      }
    }

  }

  /* Subform form group*/
  Education(): FormGroup {
    return this.fb.group({
      Degree: [''],
      Institute: [''],
      Subject: [''],
      PassingYear: [''],
      Grade: [''],
      Percentage: [''],

    });
  }
  Experience(): FormGroup {
    return this.fb.group({
      Employer: [''],
      JobTitle: [''],
      JobDescription: [''],
      StartDate: [''],
      Experience: ['']
    });
  }


  Skill(): FormGroup {
    return this.fb.group({
      Skill: [''],
    });
  }

  get PersonalDetails() {
    return this.ResumeForm.get('PersonalDetails');
  }

  get Experiences() {
    return this.ResumeForm.get('Experiences') as FormArray;
  }
  get Educations() {
    return this.ResumeForm.get('Educations') as FormArray;
  }

  get Skills() {
    return this.ResumeForm.get('Skills') as FormArray;
  }

  addExperience() {
    this.Experiences.push(this.Experience());
  }

  addEducation() {
    this.Educations.push(this.Education());
  }

  addSkill() {
    this.Skills.push(this.Skill());
  }
  removeSkill() {
    if (this.Skills.length > 1) {
      this.Skills.removeAt(this.Skill.length);
    }
  }

  public DeleteEduItem(index: any): void {
    this.Educations.removeAt(index);
    if (this.Educations.length < 4) {
      this.Educations.push(this.Education());
    }
  }

  public DeleteExpItem(index: any): void {
    this.Experiences.removeAt(index);
    if (this.Experiences.length < 4) {
      this.Experiences.push(this.Experience());
    }
  }
  public NewEID(): void {

    this.ResumeForm.reset();

    this.resumeService.GetNewEID().subscribe(
      data => this.ResumeForm.controls['PersonalDetails'].get('EID').setValue(data)

    );

    this.ResumeForm.controls['PersonalDetails'].get('FullName').setValue('Alamgir');
    this.ResumeForm.controls['PersonalDetails'].get('ContactNo').setValue('01556996663');
    this.PersonalDetails.get('Email').setValue('alamorthi@gmail.com');
    this.PersonalDetails.get('FatherName').setValue('Late Ataher Uddin Talukder');
    this.PersonalDetails.get('MotherName').setValue('Ms Nuren Naher Begum');

    this.myfield.nativeElement.focus();
  }

  public Save(): void {
    this.submitted = true;
    if (!this.ResumeForm.valid) {
      return;
    }
    this.resumeService.Save(this.ResumeForm.value).subscribe(
      (response: any) => {
        if (response == null) {
          this.toastr.success('New Resume Created!', 'Resume Successful.');
          this.submitted = false;
        } else {
          response.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateEID':
                this.toastr.error('Resume is already taken', 'Resume failed.');
                break;

              default:
                this.toastr.error(element.description, 'Resume failed.', {
                  timeOut: 2000
                });
                break;
            }

          });
        }
      },
      err => {
        console.log(err);
      }
    );

  }

  public Delete(EID: any): void {
    if (EID) {
      if (confirm('Are you sure to delete this record')) {
        this.resumeService.Delete(EID).subscribe(res => {
          if (res == null) {
            this.toastr.warning("Deleted Successfully", "Resume Information");
            this.ResumeForm.reset();

          }
        });
      }
    }

  }

  generatePdf(action = 'open') {
    const documentDefinition = this.getDocumentDefinition();
    //const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    switch (action) {
      case 'open': this.pdfService.pdfMake.createPdf(documentDefinition).open(); break;
      // case 'open': this.pdfService.pdfMake.createPdf(documentDefinition).open({}, window); break;
      case 'print': this.pdfService.pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': this.pdfService.pdfMake.createPdf(documentDefinition).download(); break;
      default: this.pdfService.pdfMake.createPdf(documentDefinition).open(); break;
    }
  }



  Cancel() {
    this.ResumeForm.reset();
  }



  getDocumentDefinition() {
    sessionStorage.setItem('resume', JSON.stringify(this.resume));
    return {
      watermark: { text: 'Resume of ' + this.PersonalDetails.get('FullName').value, color: 'blue', opacity: 0.1, bold: false, italics: false, angle: 45 },
      content: [
        {
          text: 'Resume of ' + this.PersonalDetails.get('FullName').value,
          bold: true,
          fontSize: 18,
          alignment: 'center',
          margin: [0, 0, 0, 3]
        },
        {
          text: 'Mobile : ' + this.PersonalDetails.get('ContactNo').value,
          bold: true,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 2]
        },
        {
          text: 'Email : ' + this.PersonalDetails.get('Email').value,
          link: this.PersonalDetails.get('Email').value,
          color: 'blue',
          bold: true,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },

        {
          columns: [
            [
              // {
              //   text: this.PersonalDetails.get('FullName').value,
              //   style: 'name'
              // },
              {
                text: 'FatherName : ' + this.PersonalDetails.get('FatherName').value,
              },
              {
                text: 'MotherName : ' + this.PersonalDetails.get('MotherName').value
              },
              {
                text: 'PresentAddress : ' + this.PersonalDetails.get('PresentAddress').value
              },
              {
                text: 'PermanentAddress : ' + this.PersonalDetails.get('PermanentAddress').value
              },
              // {
              //   text: 'Email : ' + this.PersonalDetails.get('Email').value,
              // },
              // {
              //   text: 'Contant No : ' + this.PersonalDetails.get('ContactNo').value,
              // },
              {
                text: 'GitHub: ' + this.PersonalDetails.get('SocialProfile').value,
                link: this.resume.SocialProfile,
                color: 'blue',
              }
            ],
            [
              this.getProfilePicObject()
            ]
          ]
        },
        {
          text: 'Skills',
          style: 'header'
        },
        this.getSkillObject(this.resume.Skills),

        {
          text: 'Experience',
          style: 'header'
        },

        this.getExperienceObject(this.resume.Experiences),

        {
          text: 'Education',
          style: 'header'
        },

        // {text: 'Education', style: 'subheader'},

        this.getEducationObject(this.resume.Educations),

        {
          text: 'Other Details',
          style: 'header'
        },
        {
          text: this.PersonalDetails.get('OtherDetails').value
          //text: 'this.resume.OtherDetails'
        },

        {
          text: 'Signature',
          style: 'sign'
        },
        {
          columns: [
            { qr: this.PersonalDetails.get('FullName').value + ', Contact No : ' + this.PersonalDetails.get('ContactNo').value, fit: 100 },
            {
              text: `(${this.PersonalDetails.get('FullName').value})`,
              alignment: 'right',
            }
          ]
        },


      ],


      info: {
        title: this.PersonalDetails.get('FullName').value + '_RESUME',
        author: this.PersonalDetails.get('FullName').value,
        // title: this.resume.FullName + '_RESUME',
        // author: this.resume.FullName,
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline'
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        name: {
          fontSize: 16,
          bold: true
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: 'right',
          italics: true
        },
        tableHeader: {
          bold: true,
        }
      }
    };
  }

  getSkillObject(Skills: Skill[]) {
    const skl = [];

    for (let i = 0; i < this.Skills.length; i++) {

      skl.push(
        [{
          columns: [
            {
              text: this.Skills.at(+i).get('Skill').value,
            },

          ]
        }]
      );
    }

    return {

      columns: [
        {
          ul: [
            ...skl.filter((value, index) => index % 3 === 0)
          ]
        },
        {
          ul: [
            ...skl.filter((value, index) => index % 3 === 1)
          ]
        },
        {
          ul: [
            ...skl.filter((value, index) => index % 3 === 2)

          ]
        },

      ]

    };
  }



  getExperienceObject(Experiences: Experience[]) {
    const exs: any = [];

    for (let i = 0; i < this.Experiences.length; i++) {

      if (this.Experiences.at(+i).get('Employer').value != null || i == 0) {
        exs.push(
          [{
            columns: [
              [{
                text: this.Experiences.at(+i).get('JobTitle').value,
                style: 'jobTitle'
              },
              {
                text: this.Experiences.at(+i).get('Employer').value,
              },
              {
                text: this.Experiences.at(+i).get('JobDescription').value,
              },
              {
                text: 'Starting Date: ' + formatDate(this.Experiences.at(+i).get('StartDate').value),
              }],
              {
                text: 'Experience : ' + this.Experiences.at(+i).get('Experience').value + ' Years',
                alignment: 'right'
              }
            ]
          }]
        );
      }

    }
    console.log(exs);

    return {
      table: {
        headerRows: 1,
        widths: ['*'],
        body: [
          ...exs
        ]
      },
      // layout: {
      // 	fillColor: function (rowIndex, node, columnIndex) {
      // 		return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
      // 	}
      // }
    };
  }

  getEducationObject(educations: Education[]) {

    const edu = [];
    for (let i = 0; i < this.Educations.length; i++) {
      if (this.Educations.at(i).get('Degree').value != null) {
        edu.push([
          this.Educations.at(i).get('Degree').value,
          this.Educations.at(i).get('Institute').value,
          this.Educations.at(i).get('Subject').value,
          this.Educations.at(i).get('PassingYear').value,
          this.Educations.at(i).get('Grade').value,
          this.Educations.at(i).get('Percentage').value,
        ]
        );
      }

    }

    return {
      //layout: 'lightHorizontalLines',
      //Table supports three layouts : noBorders, headerLineOnly, lightHorizontalLines 
      table: {
        headerRows: 1,
        widths: ['*', '*', '*', '*', '*', '*'],
        body: [
          [{
            text: 'Degree',
            style: 'tableHeader'
          },
          {
            text: 'Institute',
            style: 'tableHeader'
          },
          {
            text: 'Subject',
            style: 'tableHeader'
          },
          {
            text: 'Passing Year',
            style: 'tableHeader'
          },
          {
            text: 'Grade',
            style: 'tableHeader'
          },
          {
            text: 'Percentage',
            style: 'tableHeader'
          },
          ],

          ...edu

        ]
      },

      layout: {
        hLineWidth: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 2 : 1;
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 2 : 1;
        },
        hLineColor: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
        },
        vLineColor: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
        },
        // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
        // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
        // paddingLeft: function(i, node) { return 4; },
        // paddingRight: function(i, node) { return 4; },
        // paddingTop: function(i, node) { return 2; },
        // paddingBottom: function(i, node) { return 2; },
        // fillColor: function (rowIndex, node, columnIndex) { return null; }
      }


    };
  }



  getProfilePicObject() {
    if (this.resume.ProfilePic) {
      return {
        image: this.resume.ProfilePic,
        width: 75,
        alignment: 'right'
      };
    }
    return null;
  }

  fileChanged(e) {
    const file = e.target.files[0];
    // console.log(file);
    this.getBase64(file);
    this.PersonalDetails.get('ProfilePic').patchValue(file.name);
  }

  getBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    console.log(file);
    reader.onload = () => {
      console.log(reader.result);// Need to copy this log file for getting image
      this.resume.ProfilePic = reader.result as string;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }


}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    //day = '' + (d.getDate() + 1),
    day = '' + (d.getDate()),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('/');
}