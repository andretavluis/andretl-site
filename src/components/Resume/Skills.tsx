import type { CSSProperties } from 'react';

import type { SkillGroup } from '@/data/resume/skills';

interface SkillsProps {
  groups: SkillGroup[];
}

export default function Skills({ groups }: SkillsProps) {
  return (
    <div className="skills">
      <div className="link-to" id="skills" />
      <div className="title">
        <h3>Skills</h3>
      </div>
      <div className="skill-groups">
        {groups.map((group) => (
          <div
            key={group.name}
            className="skill-group"
            style={{ '--group-color': group.color } as CSSProperties}
          >
            <h4 className="skill-group-title">{group.name}</h4>
            <ul className="skill-tags">
              {group.skills.map((skill) => (
                <li key={skill} className="skill-tag">
                  <span className="skill-tag-name">{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
