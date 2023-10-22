import "reflect-metadata";
import { isMethod, createInstance } from "../utils";

export type MiddlewareImplementation<T> = (
  payload: T,
  target: any,
  propertyKey?: string
) => Promise<unknown>;

export function UseMiddlewares(...middlewares: MiddlewareImplementation<any>[]) {
  return function (
    /**
     * @param target - Representa a classe que o decorator está
     * @example
     * ```
     * class Dog {
     *  ~@UseMiddlewares()
     *  public async walk() {}
     * }
     * target = Dog
     * ```
     */
    target: any,
    /**
     * @param propertyKey - Representa o nome da propriedade em que o decorator está sendo aplicado
     * @example
     * ```ts
     * class Dog {
     *  ~@UseMiddlewares()
     *  public async walk() {}
     * }
     * ```
     * propertyKey = "walk"
     *
     * @example
     * ```ts
     * class Dog {
     *  ~@UseMiddlewares()
     *  private name: string;
     * }
     * ```
     * propertyKey = "name"
     */
    propertyKey?: string,
    /**
     * @param descriptor - Representa o método em que o decorator está sendo aplicado
     * @example
     * ```ts
     * class DOG {
     *  ~@UseMiddlewares()
     *  public async walk() {}
     * }
     * ```
     * descriptor = [Function: walk]
     */
    descriptor?: PropertyDescriptor
  ): any {
    // Se o decorator estiver sendo aplicado em uma classe, então nem propertyKey nem descriptor existem, essa checagem é feita para saber se o decorator está sendo aplicado em uma classe ou em um método/propriedade de uma classe.
    if (propertyKey) {
      // O decorator pode ser aplicado a um método ou a uma propriedade, então é necessário verificar se o decorator está sendo aplicado a um método ou a uma propriedade.
      if (descriptor && descriptor.value) {
        // Caso o decorator esteja sendo aplicado a um método, então é necessário envolver o método com os middlewares, utilizando a função wrapWithMiddlewares (definida abaixo).
        descriptor.value = wrapWithMiddlewares(
          descriptor.value,
          middlewares,
          target,
          propertyKey
        );
        return descriptor;
      }
      // Não faria sentido aplicar um middleware em uma propriedade, então basta retornar a função.
      return;
    }

    // Caso o decorator esteja sendo aplicado em uma classe, então é necessário criar uma instância da classe para que os middlewares sejam aplicados nos métodos da classe.
    wrapPrototypeMethods(target, middlewares);
  };
}

function wrapWithMiddlewares(
  /**
   * @param originalMethod - Representa o método original que será envolvido pelos middlewares (vem do descriptor.value)
   */
  originalMethod: any,
  /**
   * @param middlewares - Representa os middlewares que serão aplicados no método original
   * @example
   * ```ts
   * class Dog {
   *  ~@UseMiddlewares(middleware1, middleware2)
   *  public async walk() {}
   * }
   * ```
   * middlewares = [middleware1, middleware2]
   */
  middlewares: MiddlewareImplementation<any>[],
  /**
   * @param target - Representa a classe que o decorator está
   */
  target: any,
  /**
   * @param propertyKey - Representa o nome da propriedade em que o decorator está sendo aplicado
   */
  propertyKey?: string
) {
  return async function (payload: unknown): Promise<unknown> {
    for (const middleware of middlewares) {
      // Executa os middlewares na ordem em que foram passados
      await middleware(payload, target, propertyKey);
    }

    // @ts-ignore: Tipar o 'this' abaixo é difícil.
    // Em seguida executa o método original
    return await originalMethod.call(this as any, payload);
  };
}

function wrapPrototypeMethods(target: any, middlewares: MiddlewareImplementation<any>[]) {
  // Pega o prototype da classe
  const prototype = target.prototype;

  Object.getOwnPropertyNames(prototype).forEach((propertyKey) => {
    // Verifica se a propriedade é um método
    if (!isMethod(prototype, propertyKey)) return;

    // Salva o método em uma variável
    const originalMethod = prototype[propertyKey];

    // Substitui o método original pelo método envolvido pelos middlewares
    prototype[propertyKey] = wrapWithMiddlewares(originalMethod, middlewares, target);
  });
}
