import { DependencyList, ReactElement, useMemo } from 'react'

const PENDING = Symbol('suspense.pending')
const SUCCESS = Symbol('suspense.success')
const ERROR = Symbol('suspense.error')

type RenderCallback<T> = (data: T) => ReactElement<any, any> | null

export interface SuspendableProps<T> {
  data: () => T
  children: RenderCallback<T>
}

/**
 * Simple Wrapper indicate the component is suspendable.
 * `useSuspendableData` will create the contract that consumed by <Suspense> Component
 *
 * ```js
 *  const UserPage = ({ userId }) => {
 *    const suspendableData = useSuspendableData(() => getUserAsync({ id: userId }), [userId])
 *
 *    return (
 *      <Suspense fallback={<Loading />}>
 *         <Suspendable data={suspendableData}>
 *           {data => <UserProfile user={data}/>}
 *         </Suspendable>
 *      </Suspense>
 *    )
 *  }
 * ```
 *
 * @param data
 * @param children
 * @constructor
 */
export const Suspendable = <T>({ data, children }: SuspendableProps<T>) => {
  return children(data())
}

/**
 * `useSuspendableData` will only execute the promiseProvider when one of the `deps` has changed.
 *
 * Notes: internally use `useMemo` keep track the `deps` changes
 *
 * @param promiseProvider
 * @param deps
 */
export function useSuspendableData<T>(
  promiseProvider: () => PromiseLike<T>,
  deps: DependencyList | undefined,
): () => T {
  if (typeof promiseProvider !== 'function') {
    throw Error('promiseProvider is not a function')
  }

  return useMemo(() => {
    let status = PENDING
    let error: any
    let result: T
    const suspender = Promise.resolve()
      .then(() => promiseProvider())
      .then(r => {
        status = SUCCESS
        result = r
      })
      .catch(err => {
        status = ERROR
        error = err
      })
    return () => {
      switch (status) {
        case PENDING:
          throw suspender
        case ERROR:
          throw error
        case SUCCESS:
          return result
        default:
          throw Error('internal error. This should not happen')
      }
    }
  }, deps)
}
