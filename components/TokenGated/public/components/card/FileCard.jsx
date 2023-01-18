import React from 'react';
import { useSelector } from 'react-redux';
export default function FileCard({ content }) {
  const userinfo = useSelector((state) => state.user.userinfo);
  return <div>{content?.title}</div>;
}
