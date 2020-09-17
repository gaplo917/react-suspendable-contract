# React Suspendable Contract
Enjoy React Suspense for async data fetching **without rewriting existing components**.

This module provides a simple wrapper `<Suspendable>` and a simple hook `useSuspendableData(..)` to fulfill the 
Suspense data fetching contract.

**\[Experimental]: React.Suspense for data fetching is under experimental mode! (even React 17.0)**

### Getting Start
```
yarn add react-suspendable-contract

# OR

npm install --save react-suspendable-contract
```

### Support
✅ Typescript support

### Example
```
import { Suspendable, useSuspendableData } from 'react-suspendable-contract'

const UserPage = ({ userId }) => {
  const suspendableData = useSuspendableData(() => getUserAsync({ id: userId }), [userId])

  return (
    <Suspense fallback={<Loading />}>
       <Suspendable data={suspendableData}>
         {data => <UserProfile user={data}/>}
       </Suspendable>
    </Suspense>
  )
}
```

### License
MIT
