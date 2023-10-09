import { Component } from '@angular/core';
import { TaskService } from '../services/task.service';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  type : string = "pending";

  constructor(public alertController: AlertController,
             public taskService: TaskService,
             public toastController: ToastController,
             public popoverController : PopoverController){}

  async presentAlertPromptAdd(){
    const alert = await this.alertController.create({
      header: 'Add Task!',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'Task'
        } ,
        {
          name: 'date',
          type: 'date',
          min: '2023-01-01',
          max: '2023-12-31'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Save',
          handler: (alertData) => {
            if(alertData.task != "")
            this.taskService.addTask(alertData.task, alertData.date)
          else {
            this.presentToast();
            this.presentAlertPromptAdd();
          }
          }
        }
      ]
    });

    await alert.present();

  }

  async presentAlertPromptDelete(index : number){
    const alert = await this.alertController.create({
      header: 'Delete Task!',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Delete',
          handler: () => this.presentAlertPromptDelete(index)
        }
      ]
    });

    await alert.present();

  }

  async presentAlertPromptUpdate(index : number, task : any){
    const alert = await this.alertController.create({
      header: 'Update Task!',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'Task',
          value: task.value
        } ,
        {
          name: 'date',
          type: 'date',
          min: '2023-01-01',
          max: '2023-12-31',
          value: ((task.date.getMonth()+1) < 10 ? "0" + task.date.getMonth()+1 : task.date.getMonth()+1) + "-" + (task.date.getDay() < 10 ? "0" + task.date.getDay() : task.date.getDay())
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Save',
          handler: (alertData) => {
            if(alertData.task != "")
            this.taskService.updateTask(index, alertData.task, alertData.date)
          else {
            this.presentToast();
            this.taskService.updateTask(index, alertData.task, alertData.date);
          }
          }
        }
      ]
    });

    await alert.present();

  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: "Preencha a tarefa",
      duration: 2000
    });
    toast.present();
  }

  async presentPopover(ev :any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }



}
