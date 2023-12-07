
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TableService } from 'src/app/services/table.service';
import { ManagernameService } from 'src/app/services/managername.service';
import { Router } from '@angular/router';
import { SkillsdropdownService } from 'src/app/services/skillsdropdown.service';
import { AuthService } from 'src/app/Guard/auth.service';
import { CandidateAssessmentService } from 'src/app/services/candidate-assessment.service';
import { ReviewerService } from 'src/app/services/reviewer.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-assessment-table',
  templateUrl: './assessment-table.component.html',
  styleUrls: ['./assessment-table.component.scss']
})
export class AssessmentTableComponent {
  [x: string]: any;
  questionType: string[] = ['Radio', 'Multiple Choice', 'Text'];

  status : string[] = ["Shortlisted", "Rejected" , "Awaiting" , "Cancelled" , "Scheduled"];

  items: MenuItem[] | undefined;
  
  candidateNames: any[] = [];
  name: boolean = true;
  finalizedEmail!: string;
  candidateList: any[] = [];
  finalizedManagerEmail!: string;
  managerEmail!: string;
  selectedCandidates: any[] = [];
  score: number | null = null;
  result: string = '';
  candidateId!: Date | null;
  candidateNameOptions: any[] = [];
  candidateName: any[] = [];
  email_Managername!: string;
  email_Status!: string;
  email_Filename!: string;
  questions: any;
  cutoff!: number;
  durations!: number;
  roles: string = "user";
  skillSet: any[] = [];
  managerOption: any[] = [];

  // candidateForm !: FormGroup;
  constructor(
    private tableService: TableService,
    private managernameService: ManagernameService,
    private skillsdropdownservice: SkillsdropdownService,
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private candidateService: CandidateAssessmentService,
    // reviewer
   
  ) {
    // this.candidateForm = this.formBuilder.group({
    //   candidateName: ['', Validators.required],
    //   candidateEmail: ['', Validators.required,Validators.email],
    //   candidatePhone: [null]
    // });
  }
  ngOnInit() {
    //this.auth.isLoggedIn=true;
   
    //for candidate
    // this.finalizedEmail =
    //   this.managernameService.getCandidateAssessment_Email();
    // console.log('a', this.finalizedEmail);

    //for manager
    // this.finalizedManagerEmail = this.managernameService.getManagerName_Email();
    // console.log('manager-email--', this.finalizedManagerEmail);

    

    this.loadManagerNames();
    this.getSkillSet();
    
    this.loadCandidate();
    this.getCandidatename();
 

    this.items = [{ label: 'Home',routerLink:'/login',icon: 'pi pi-home' }, { label: 'Assessment' , routerLink: "dashboard"}];
  }
  getResultClass(result : string): string {
    if(result == "Shortlisted"){
      return "Shortlisted"
    }
    else if(result == "Rejected"){
      return "Rejected"
    }else if(result=="Awaiting") {
      return "Awaiting"
    }
    else if(result=="Cancelled") {
      return "Cancelled"
    }
    else  {
      return "Scheduled"
    }

  }

  getFormattedSkills(skills: any): { skills: string[], remainingCount: number } {
    const maxLength = 8;

    let result: string[] = [];
    let totalLength = 0;

    for (const skill of skills) {
      if (totalLength + skill.length <= maxLength) {
        // Include the skill in the result
        result.push(skill);
        totalLength += skill.length;
      } else {
        // Stop adding skills if the limit is reached
        break;
      }
    }

    // Calculate the count of remaining skills
    const remainingCount = skills.length - result.length;

    return { skills: result, remainingCount: remainingCount };
  }
  remainaingSkills(skills:any ,count:number):string[]{
return skills.slice(-count);
  }
  clear(table: Table) {
    table.clear();
}


  getCandidatename(): void {
    this.tableService.getExistingCandidate().subscribe((data) => {
      // Use a Set to store unique candidate email addresses
      const uniqueEmails = new Set<string>();
      // Use an array to store unique candidate names
      const uniqueCandidateNames: any[] = [];
      // Iterate through the data and filter duplicates based on email addresses
      data.forEach(
        (candidate: { candidateName: string; candidateEmail: string }) => {
          if (!uniqueEmails.has(candidate.candidateEmail)) {
            uniqueEmails.add(candidate.candidateEmail);
            uniqueCandidateNames.push(candidate.candidateName);
          }
        }
      );
      // Assign the unique candidate names to your variable
      this.candidateNames = uniqueCandidateNames;
      console.log('candidate', data);
      console.log(this.candidateNames);
    });
  }

 

  loadCandidate() {
    const role = localStorage.getItem('userrole');
    console.log('role', role);
    if (role == 'user') {
      this.name = false;
      this.candidateService
        .getCandidatedata_by_Email(this.finalizedEmail)
        .subscribe((response) => {
          console.log('res', response);
          this.candidateList = response;
          console.log(
            'candidateListdata',
            this.candidateList
          );
          this.candidateName = response[0].candidateName;
          console.log('candidateName', this.candidateName);
        });

      // localStorage.removeItem('userrole');
    } else if (role == 'manager') {
      // localStorage.removeItem('userrole');
      console.log('manager email--', this.finalizedManagerEmail);
      this.managernameService
        .getManagerdata_by_Email(this.finalizedManagerEmail)
        .subscribe((response) => {
          console.log('res', response);
          this.managerEmail = response[0].Managername;

          // this.managernameService.setManagerName_Email(this.managerEmail);

          console.log('candidateList1gr4rg', this.managerEmail);
          // this.candidateName = response[0].candidateName;
        });
      this.managernameService.getCandidateStatus().subscribe((data) => {
        // console.log("arole",a)
        this.candidateList = data;
        console.log('ss', data);
      });
      // localStorage.removeItem('userrole');
    }

    console.log('load data 1', this.candidateList);
    console.log('selected candidate', this.selectedCandidates);
    // Loop through selectedCandidates and store data for each candidate
    this.selectedCandidates.forEach((selectedCandidate) => {
      // Find the existing candidate data based on the candidateName
      const existingCandidate = this.candidateList.find(
        (candidate) => candidate.candidateName === selectedCandidate
      );
      console.log('matched candidate', existingCandidate);

      //rest data
      this.score = null;
      this.result = '';
      const date = Date.now();
      this.candidateId = new Date(date);

      //show success message
      // this.showEmailSubmitted();
      
      if (existingCandidate) {
        this.tableService
          .postExistingCandidateDetails(
            this.candidateId,
            this.email_Managername,
            existingCandidate.candidateName,
            existingCandidate.candidateEmail,
            existingCandidate.candidatePhone,
            this.email_Status,
            this.email_Filename,
            this.questions,
            this.score,
            this.result,
            this.cutoff,
            this.durations,
            existingCandidate.password,
            existingCandidate.confirmPassword,
            this.roles
          )
          .subscribe((data) => {
            console.log('Stored data for existing candidate:', data);
            //this.candidateName(data);
            this.candidateList.push(data);
            
          });

        setTimeout(() => {
          this.getCandidatename();
          
        }, 2000);
      }
    });
    
  }

  loadAssessmentData() {
    this.managernameService.getCandidateStatus().subscribe((data) => {
      // console.log("arole",a)
      this.candidateList = data;
      console.log('sapna', data);
    });
  }
  getSkillSet() {
    this.skillsdropdownservice.getskillsList().subscribe((data) => {
      this.skillSet = data;
      console.log('skillset',this.skillSet);
    });
  }
 
 

  loadManagerNames() {
    this.managernameService.getManagerNames().subscribe((data) => {
      this.managerOption = data;
      console.log('sapna',data);
    });
  }
  
}