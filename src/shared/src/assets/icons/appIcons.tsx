import styles from './appIcons.module.css'

export const ExitButton: React.FC<IconProps> = ({
  height,
  width,
  onClick,
  pathFill,
  svgFill,
  strokeColor,
  title
}) => {
  return (
    <ButtonWrapper 
      onClick={onClick}
      title={title}  
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={svgFill}
        viewBox="0 0 24 24"
      >
        <path
          fill={pathFill}
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </ButtonWrapper>
  );
};

export const BackButton: React.FC<IconProps> = ({
  height,
  width,
  onClick,
  svgFill,
  pathFill,
  strokeColor,
  title
}) => {
  return (
    <ButtonWrapper onClick={onClick} title={title}>
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={svgFill}
        viewBox="0 0 24 24"
      >
        <path
          fill={pathFill}
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M5 12h14M5 12l4-4m-4 4 4 4"
        />
      </svg>
    </ButtonWrapper>
  );
};

export const HomeButton: React.FC<IconProps> = ({
  height,
  width,
  onClick,
  svgFill,
  strokeColor,
  pathFill,
  title
}) => {
  return (
    <ButtonWrapper onClick={onClick} title={title}>
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={svgFill}
        viewBox="0 0 24 24"
      >
        <path
          fill={pathFill}
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
        />
      </svg>
    </ButtonWrapper>
  );
};

export const EditButton: React.FC<IconProps> = ({
  height,
  width,
  onClick,
  strokeColor,
  svgFill,
  pathFill,
  title
}) => {
  return (
    <ButtonWrapper onClick={onClick} title={title}>
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={svgFill}
        viewBox="0 0 24 24"
      >
        <path
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
          fill={pathFill}
          d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
        />
      </svg>
    </ButtonWrapper>
  );
};

export const ScrapeButton: React.FC<IconProps> = ({
  height,
  width,
  onClick,
  title
}) => {
  return (
    <ButtonWrapper onClick={onClick} title={title}>
      <svg
        viewBox="-0.56 0 171.265 171.265"
        xmlns="http://www.w3.org/2000/svg"
        height={height}
        width={width}
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          
          <g id="scraper" transform="translate(-421.662 -997.216)">
            
            <path
              id="Path_105"
              d="M567.7,1015.657a4,4,0,1,0,5.656,0A4,4,0,0,0,567.7,1015.657Z"
            ></path>
            <path
              id="Path_106"
              d="M591.8,1017.423a19.372,19.372,0,0,0-5.711-13.787l-.707-.709a19.5,19.5,0,0,0-27.578,0l-40.61,40.61c-25.274-2.8-61.3,14.466-92.591,44.575l-2.94,2.828,77.541,77.54,2.827-2.939c30.688-31.9,48.212-69.5,44.308-94.58l39.75-39.75A19.373,19.373,0,0,0,591.8,1017.423Zm-52.871,60.949c.113,21.706-14.987,51.8-39.863,78.658l-65.951-65.951c25.689-23.775,54.811-38.8,76.333-39.794l-7.859,7.859,28.285,28.283Zm41.5-52.817-50.558,50.56L512.9,1059.144l50.559-50.559a11.5,11.5,0,0,1,16.262,0l.708.709a11.5,11.5,0,0,1,0,16.263Z"
            ></path>
          </g>
        </g>
      </svg>
    </ButtonWrapper>
  );
};

export const DeleteButton: React.FC<IconProps> = ({
  height,
  width,
  onClick,
  svgFill,
  pathFill,
  strokeColor,
  title
}) => {
  return (
    <ButtonWrapper onClick={onClick} title={title}>
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={svgFill}
        viewBox="0 0 24 24"
      >
        <path
          fill={pathFill}
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
        />
      </svg>
    </ButtonWrapper>
  );
};

export const SeeButton: React.FC<IconProps> = ({
  height,
  width,
  onClick,
  pathFill,
  svgFill,
  strokeColor,
  title
}) => {
  return (
    <ButtonWrapper onClick={onClick} title={title}>
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={svgFill}
        viewBox="0 0 24 24"
      >
        <path
          fill={pathFill}
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke-width="1.5"
          d="M19 12H5m14 0-4 4m4-4-4-4"
        />
      </svg>
    </ButtonWrapper>
  );
};

const ButtonWrapper: React.FC = ({
  children,
  onClick,
  buttonStyle
})=>{

  return (
  <button
    onClick={onClick}
    className={buttonStyle ? buttonStyle : styles.icon_button}
  >
    {children}
  
  </button>)

}
