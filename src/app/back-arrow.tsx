"use client";
import { useRouter } from 'next/router';
import { BsDash } from 'react-icons/bs';
import { IoArrowUndo } from 'react-icons/io5';

const BackArrow = () => {
  const router = useRouter();

  return (
    <button className="btn btn-outline-success back-arrow" onClick={() => router.back()} >
      <i className="bi bi-arrow-left-circle-fill"></i>&nbsp;&nbsp;Previous Page
    </button>
  );
};

export default BackArrow;