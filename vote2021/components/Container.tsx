interface ContainerProps {
  children: React.ReactNode;
}

const Container = (props: ContainerProps) => {
  return (
    <div className="w-full max-w-screen-sm ml-auto mr-auto">
      {props.children}
    </div>
  );
};

export { Container };
