import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';

import BrandLogo from '@/components/Logos/BrandLogo';
import type { Position } from '@/data/resume/work';

interface JobProps {
  data: Position;
}

export default function Job({ data }: JobProps) {
  const { name, logo, position, url, startDate, endDate, summary, highlights } =
    data;

  return (
    <article className="jobs-container">
      <header className="entry-header">
        {logo ? (
          <BrandLogo logo={logo} decorative className="entry-logo" />
        ) : null}
        <h4>
          {url ? <a href={url}>{name}</a> : name} - {position}
        </h4>
        <p className="daterange">
          {' '}
          <time dateTime={startDate}>
            {dayjs(startDate).format('MMMM YYYY')}
          </time>{' '}
          -{' '}
          {endDate ? (
            <time dateTime={endDate}>{dayjs(endDate).format('MMMM YYYY')}</time>
          ) : (
            'Present'
          )}
        </p>
      </header>
      {summary ? (
        <Markdown
          options={{
            overrides: {
              p: {
                props: {
                  className: 'summary',
                },
              },
              code: {
                component: ({ children }) => <>{children}</>,
              },
              pre: {
                component: ({ children }) => <>{children}</>,
              },
            },
          }}
        >
          {summary}
        </Markdown>
      ) : null}
      {highlights ? (
        <ul className="points">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
