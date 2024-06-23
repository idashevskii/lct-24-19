import { Container } from 'inversify';
import { inject, type InjectionKey, type App } from 'vue';

const APP_PROVIDE: InjectionKey<Container> = Symbol();

type Service<T = unknown> = new (...args: never[]) => T;

interface DiConfig {
  services?: Service[];
}

export const useService = <T>(clazz: Service<T>) => {
  const injector = inject(APP_PROVIDE);
  if (!injector) {
    throw 'Injector not provided';
  }
  return injector.get<T>(clazz);
};

export const createInjector = (config: DiConfig) => {
  const injector = new Container();
  for (const cls of config.services || []) {
    injector.bind(cls).to(cls).inSingletonScope();
  }

  return {
    get: <T>(cls: Service<T>) => injector.get<T>(cls),
    install: (app: App) => {
      app.provide(APP_PROVIDE, injector);
    },
  };
};
