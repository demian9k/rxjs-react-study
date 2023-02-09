import React, {PropsWithChildren, useEffect, useState} from "react";
import {Link, LinkProps, Outlet, useParams} from "react-router-dom";
import { css } from '@emotion/css'

interface NestedLinkProps extends LinkProps {
}

const nestedLinkStyle = css`
  color:white;
  &:hover{
    color : dodgerblue;
  }
`

const NestedLink = (props: PropsWithChildren<NestedLinkProps>) => {
    return (<Link
        className={nestedLinkStyle}
    {...props}
>
    {props.children}
    </Link>)
}


export default NestedLink