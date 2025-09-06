import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InjectorService {
  private static injector: Injector;

  public static setInjector(injector: Injector) {
    if (InjectorService.injector) {
      // Don't override
      return;
    }
    InjectorService.injector = injector;
  }

  public static getInjector(): Injector {
    return InjectorService.injector;
  }
}