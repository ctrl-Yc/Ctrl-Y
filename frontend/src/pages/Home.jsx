import React from 'react'
import Btn from '../../components/btn'

export const Home() {
  return (
     <div>
      <h2 className="text-3xl font-bold underline text-blue-500">Hello World</h2>
      <Btn onClick={() => alert('押された')}>押す</Btn>
    </div>
  )
}
