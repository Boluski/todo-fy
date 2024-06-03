"use client";

export default function Project({ params }: { params: { id: string } }) {
  return (
    <>
      <h1>Project ID: {params.id}</h1>
    </>
  );
}
