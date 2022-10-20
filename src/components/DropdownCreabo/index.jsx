import styles from "./style.module.css";

const DropdownCreabo = ({
  label,
  value,
  handleChange,
  options,
  defaultValue,
  id,
  disabled,
}) => {
  return (
    <div className={styles.dropdownCreabo}>
      <label htmlFor={id} className="text-[14px] text-[#303548] font-regular">
        {label}
      </label>

      <select
        disabled={disabled}
        value={value}
        onChange={handleChange}
        id={id}
        className="mt-1 text-[#7D849D] px-2 text-[14px] font-regular rounded-[3px] border-[1px] border-[#C7CEE6]"
      >
        {label && <option value={""}>{defaultValue}</option>}
        {options?.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownCreabo;
