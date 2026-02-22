import IconButton from './IconButton';

function CloseButton({ onClick, title = 'Cerrar', ariaLabel = 'Cerrar', style = {} }) {
  return (
    <IconButton
      icon="×"
      onClick={onClick}
      title={title}
      ariaLabel={ariaLabel}
      variant="close"
      style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '1.5em', ...style }}
    />
  );
}

export default CloseButton;
