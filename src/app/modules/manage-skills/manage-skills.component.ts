import { Component,ChangeDetectorRef,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TableService } from 'src/app/services/table.service';
import { ManagernameService } from 'src/app/services/managername.service';

import { SkillsdropdownService } from 'src/app/services/skillsdropdown.service';
import { AuthService } from 'src/app/Guard/auth.service';
import { CandidateAssessmentService } from 'src/app/services/candidate-assessment.service';
import { ReviewerService } from 'src/app/services/reviewer.service';
//import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import * as Papa from 'papaparse';
import { saveAs } from 'file-saver';
import {
  ConfirmationService,
  MessageService,
  ConfirmEventType,
  MenuItem,
} from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-skills',
  templateUrl: './manage-skills.component.html',
  styleUrls: ['./manage-skills.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class ManageSkillsComponent {
  item: any[] = [];
  todayDate!: string;
  items: MenuItem[] | undefined;
  visible: boolean = false;
  scheduleName!: string;
  tabs: { title: any; content: any }[] = [];
  skills: any[] = [];
  previewSidebarVisible : boolean = false;
  questionPreviewvisible:boolean=false;
  singleQuestion: any;
  singleQuestionOption : any
  singleQuestionAnswer : any;
  selectedquestions: any[] = [];
 
 
 
  constructor(
   
    private skillsdropdownservice: SkillsdropdownService,
    private router: Router,
    private managerService: ManagernameService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
   
 
  ) {
    // this.data=this.dataservice.sharedData;
  }
 
 
  ngOnInit()
  {
    this.todayDate = this.formattedDate(new Date());
    this.getSkillSet();
    this.items = [
      { label: 'Home', routerLink: '/login', icon: 'pi pi-home' },
      { label: 'Skills', routerLink: '/manage-skills' },
    ];
 
  }
  formattedDate(date: Date) {
    const months: string[] = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
 
    const month: string = months[date.getMonth()];
    const day: number = date.getDate();
    const year: number = date.getFullYear();
    const formatDate: string = `${month} ${day}, ${year}`;
 
    return formatDate;
  }
  clear(table: Table) {
    table.clear();
  }
 
  cancelButton() {
    this.visible = false;
    this.resetData();
  }
 
  resetData() {
    this.scheduleName = '';
  }
 
  getSkillSet() {
    this.skillsdropdownservice.getskillsList().subscribe((data) => {
      this.skills = data;
      this.postSkill();
     
      console.log('skillset',this.skills);
    });
  }
 
  postSkill(){
    console.log("skill inside post",this.skills)
    this.skillsdropdownservice
    .postskillsList(this.skills)
    .subscribe((response) => {
      console.log('recieved response', response);
      // this.ngzone.run(() => {
      // Your code that triggers change
      // this.tabs.push(...transformedData);
      for (let i = 0; i < response.length; i++) {
        this.tabs.push({
          title: response[i].skills,
          content: response[i].data,
        });
      }
console.log("tabs",this.tabs);
      this.cdr.detectChanges();
    });
  }
  onPreviewClick(data:any){
    this.selectedquestions=data;
    this.previewSidebarVisible = true;
    console.log("inside the preview",this.selectedquestions);
 
 
}
questionPreview(questions: any) {
  this.questionPreviewvisible = true;
  this.singleQuestion = questions.question;
  this.singleQuestionOption = questions.options
  this.singleQuestionAnswer = questions.answer;
}
 
getSelectedOptions(selected_Option: any, option: any) {
  console.log("Function Working")
  if (option.includes(selected_Option)) {
    console.log('correct answer');
    return 'correctAnswer';
  } else {
    return 'wrongAnswer';
  }
}
getLabel(index: number) {
  return String.fromCharCode(65 + index);
}
newUestionAdd() {
  this.visible = true;
}

storeSkill() {
  this.skillsdropdownservice
    .postOneSkill(this.scheduleName)
    .subscribe((response: any) => {
      console.log('recieved response1', response);
      this.visible = false;
      this.resetData();
    });
}
storeQuestion(data: any) {
  this.managerService
    .postquestionstodb(
      data.Question,
      data.questionType,
      data.options,
      data.skill,
      data.difficulty,
      data.answer
    )
    .subscribe((data) => {
      console.log('Stored Question', data);
    });
}
uploadCsv(event: any) {
  const file: File = event.target.files[0];

  if (file) {
    const reader: FileReader = new FileReader();
    reader.onload = () => {
      const csvData: string = reader.result as string;
      this.processCsvData(csvData);
    };

    reader.readAsText(file);
  }
}
processCsvData(csvData: string) {
  Papa.parse(csvData, {
    complete: (result: { data: any }) => {
      const csvRows = result.data.filter((row: { [row: string]: string }) =>
        Object.keys(row).some((key) => row[key] !== '')
      );

      if (csvRows.length === 0) {
        this.fileUploadErrorMessage();
        this.cancelButton();
        return;
      }
      console.log('CSV Data:', csvRows);

      for (let data of csvRows) {

        console.log("Data---->",data)

        const optionsArray = [];
        for (let i = 1; data['option-' + i]; i++) {
          optionsArray.push(data['option-' + i]);
        }
        console.log('Options Array', optionsArray);

        const answerArray = [];
        for (let i = 1; data['answer-' + i]; i++) {
          answerArray.push(data['answer-' + i]);
        }
        console.log('Answer Array--', answerArray);

        const questionData = {
          Question: data.Question,
          questionType: data.questionType,
          options: optionsArray,
          skill: data.skill,
          difficulty: data.difficulty,
          answer: answerArray,
        };

        console.log('Question Data--', questionData);

        this.storeQuestion(questionData);
      }

      setTimeout(() => {
        this.fileUploadMessage();
        this.cancelButton();
      }, 1000);
    },
    header: true,
  });
}

fileUploadMessage() {
  this.messageService.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Question saved successfully',
  });
}
fileUploadErrorMessage() {
  this.messageService.add({
    severity: 'error',
    summary: 'Error',
    detail: 'File is Empty',
  });
}
downloadQuestionsCsvTemplate() {
  let csvTemplate;
  csvTemplate = `Question,questionType,difficulty,option-1,option-2,option-3,option-4,answer-1,answer2,answer-3,answer-4,skill\n`;
  const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, 'questions-template.csv');
}
}
 
// individualQuestionView(id:any,question:any,questionTypeSelected:any,choices:any,skills:any,Difficulty_Level:any,answer:any){
//   this.QuestionView=true
//   this.id=id
//   this.question=question
//   this.questionTypeSelected=questionTypeSelected
//   // this.options=choices;
//   this.choices=choices;
//   // this.choice1=choices[0]
//   // this.choice2=choices[1]
//   // this.choice3=choices[2]
//   // this.choice4=choices[3]
//   this.Difficulty_Level=this.getBackendDifficultyLevelViceVersa(
//     Difficulty_Level
//   );
//   this.skills=skills
//   this.answer=answer
 
//   console.log("id------------->",id,skills,answer,this.Difficulty_Level,choices)
 
 
 
 
// }