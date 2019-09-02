import React from 'react'
import classnames from 'classnames'

export default function ({children, ...reset}) {
    return <div
        {...reset}
        className={classnames("cccccc")}
    >{children}</div>
}
