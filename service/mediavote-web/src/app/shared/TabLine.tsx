interface TabBarProps {
  className: string;
  state: 'viewed' | 'current' | 'not-viewed';
}

function TabBar({ className, state }: TabBarProps) {
  var bg = 'bg-rose';
  if (state === 'current') {
    bg = 'bg-love';
  } else if (state === 'not-viewed') {
    bg = 'bg-overlay';
  }
  return (
    <div
      className={`${className || ''} ${bg} [transform:matrix(1,0,-0.5,1,0,0)]`}
    ></div>
  );
}

interface TabHeadProps {
  className: string;
}

function TabHead({ className }: TabHeadProps) {
  return (
    <svg
      className={className || ''}
      width="11"
      height="8"
      viewBox="0 0 11 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_107_47)">
        <path
          d="M0 4C0 1.79086 1.79086 0 4 0H7V8H4C1.79086 8 0 6.20914 0 4Z"
          fill="#907AA9"
        />
        <path d="M7 0H11L7 8V0Z" fill="#907AA9" />
      </g>
      <defs>
        <clipPath id="clip0_107_47">
          <rect width="11" height="8" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

interface TabTailProps {
  className: string;
}

function TabTail({ className }: TabTailProps) {
  return (
    <svg
      className={className || ''}
      width="11"
      height="8"
      viewBox="0 0 11 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_107_48)">
        <path d="M0 8L4 0V8H0Z" fill="#907AA9" />
        <path
          d="M4 0H7C9.20914 0 11 1.79086 11 4C11 6.20914 9.20914 8 7 8H4V0Z"
          fill="#907AA9"
        />
      </g>
      <defs>
        <clipPath id="clip0_107_48">
          <rect width="11" height="8" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

interface TabLineProps {
  page: number;
  className?: string;
}

function TabLine({ page, className }: TabLineProps) {
  // if 1rem = 16px
  // * head + tail = 11px + 7px = 18px
  // * margin * (n+1) = 2px * 6 = 12px
  // So, each bar width is: (100%-30px)/5 => 20%-6px => 20%-0.375rem
  const state = function state(tab: number) {
    if (tab < page) {
      return 'viewed';
    } else if (tab === page) {
      return 'current';
    } else {
      return 'not-viewed';
    }
  };
  return (
    <div className={`flex flex-row ${className || ''}`}>
      <TabHead className="w-[0.6875rem] h-2" />
      <TabBar className="w-[calc((100%-30px)/3)] h-2 mr-0.5" state={state(0)} />
      <TabBar className="w-[calc((100%-30px)/3)] h-2 mr-0.5" state={state(1)} />
      <TabBar className="w-[calc((100%-30px)/3)] h-2" state={state(2)} />
      <TabTail className="w-[0.6875rem] h-2" />
    </div>
  );
}

export default TabLine;
