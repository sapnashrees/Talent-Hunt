import { Component, OnInit } from '@angular/core';




@Component({
  selector: 'app-candidatequestion',
  templateUrl: './candidatequestion.component.html',
  styleUrls: ['./candidatequestion.component.scss']
})
export class CandidatequestionComponent implements OnInit {
 
  selectedOptions1 : string[][] = [];
  first: number = 0;

  rows: number = 1;

  page: number=0;
  pageCount: number=0;
  candidateName!: string;
  code!:string;
  selectedBox: number[]  = [];
  //selectedBox: number |null=null;

  selectedOptions: boolean[] = [];
  isCheckbox: boolean = false;

  // In your component class
questionSelectedOptions: { [questionId: number]: number | null } = {};


  // In your component class
  ngOnInit(): void {
   this.selectedOptions1 = this.previewOptions.map(() => []);
  }
selectOption(option : string , pageIndex :number , optionIndex : number){
  console.log("option " , option)
  this.selectedOptions1[pageIndex][optionIndex] = option;
}
toggleColor(boxNumber: number ,page : number) {
  if (this.selectedBox[page] !== null && this.selectedBox[page] === boxNumber) {
    this.selectedBox[page] = -1;
  } else {
    this.selectedBox[page] = boxNumber;
  }
}



  onPageChange(event: any) {
      this.first = event.first;
      this.rows = event.rows;
      this.page=event.page;
      this.pageCount=event.pageCount
      console.log("varun ?????" , this.selectedOptions1)
  }

  previewOptions:any=[
    {
      question:{Description :"Which of the following keywords is used to define a variable in Javascript ?", code: "<th>Table Value</th>\n<tr>Sap</tr>"},
      options:["var","let","const","None of the above"],
      selectedAnswer:["var","let"]
    },
    {
      question:{Description :"Which of the following methods is used to access HTML elements using Javascript?", code: "<th>Table Value</th>\n<tr>Sap</tr>"},
      options:["getElementbyId()","getElementsByClassName()","Both A and B","None of the above"],
      selectedAnswer:["Both A and B"]
    },

    {
      question:{Description:"When the switch statement matches the expression with the given labels, how is the comparison done?",code: "<th>Table Value</th>\n<tr>Sap</tr>"},
      options:["Both the datatype and the result of the expression are compared.","Only the datatype of the expression is compared.","Only the value of the expression is compared.","None of the Above"],
      selectedAnswer:["Both the datatype and the result of the expression are compared.","Only the value of the expression is compared."]
    }
  ];

  showQuestion(questionId: number) {
    if (!this.questionSelectedOptions[questionId]) {
      this.questionSelectedOptions[questionId] = null;
    }
  }
  


  getLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }


getCodeLines(code: string): string[] {
  return code.split('\n');
}



getSelectedOptions(selected_Option: any,option: any){
  if(selected_Option.includes(option))
  {
    console.log("correct answer")
  return "correctAnswer";
  }
  else{
    return "wrongAnswer";
  }
  }


}