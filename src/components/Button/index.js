import clsx from 'clsx';
import styles from './button.module.scss';

function Button({children, light, dark, create, edit, drop, handleClick, disabled}) {
    return (
        <>
            <button
                disabled={disabled}
                onClick={handleClick} 
                className={clsx(styles.btn_hover, {
                    [styles.color_9]: light,
                    [styles.color_3]: dark,
                    [styles.color_1]: create,
                    [styles.color_6]: edit,
                    [styles.color_11]: drop
                })}
            >
                {children}
            </button>
        </>
    );
}

export default Button;