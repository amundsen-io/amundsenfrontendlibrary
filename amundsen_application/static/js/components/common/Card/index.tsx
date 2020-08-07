import * as React from 'react';

export interface CardProps {
  title: string;
  subtitle?: string;
  copy?: string;
  isLoading?: boolean;
}

const CardShimmerLoader: React.FC = () => (
  <div className="card-shimmer-loader">
    <div className="card-shimmer-row shimmer-issues-line--1 is-shimmer-animated" />
    <div className="card-shimmer-row shimmer-issues-line--2 is-shimmer-animated" />
    <div className="card-shimmer-row shimmer-issues-line--3 is-shimmer-animated" />

    <div className="card-shimmer-loader-body">
      <div className="card-shimmer-row shimmer-issues-line--4 is-shimmer-animated" />
      <div className="card-shimmer-row shimmer-issues-line--5 is-shimmer-animated" />
    </div>
  </div>
);

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  copy,
  isLoading,
}: CardProps) => {
  let cardContent = (
    <>
      <header className="card-header">
        <h2 className="card-title">{title}</h2>
        {subtitle && <h3 className="card-subtitle">{subtitle}</h3>}
      </header>
      <div className="card-body">
        {copy && <p className="card-copy">{copy}</p>}
      </div>
    </>
  );

  if (isLoading) {
    cardContent = <CardShimmerLoader />;
  }

  return (
    <article className={`card ${isLoading ? 'is-loading' : ''}`}>
      {cardContent}
    </article>
  );
};

export default Card;
