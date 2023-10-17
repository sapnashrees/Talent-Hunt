import { Injectable,inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
class AuthClassGuard
{
  
  constructor(private router:Router,private authservice:AuthService){
    
  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ):boolean
     {
      const manager=localStorage.getItem("role");
      const user=localStorage.getItem("role1");
      console.log("managerau",manager)
      console.log("managerau",user)

      
      if(this.authservice.isAuthenticated() && manager!=null){
        localStorage.removeItem('role1');
        return true;
      }
       else{
        alert("access denied");
        localStorage.removeItem('role');

        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});

        return false;
       }
      
    }
  }
    export const isadminguard:CanActivateFn=( route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot):boolean=>
      {

        return inject(AuthClassGuard).canActivate(route,state);

      }
  


 