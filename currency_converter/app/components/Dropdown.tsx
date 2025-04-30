import ModalDropdown from "react-native-modal-dropdown";

interface DropdownProps {
  options: string[];
  defaultValue: string;
  onChange: (index: string, value: string) => void;
}

const Dropdown = ({ options, defaultValue, onChange }: DropdownProps) => {
  return (
    <ModalDropdown
      options={options}
      defaultValue={defaultValue}
      onSelect={onChange}
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#f1f5f9",
        borderWidth: 1,
        borderColor: "#94a3b8",
        borderRadius: 8,
        marginBottom: 16,
        elevation: 2,
      }}
      textStyle={{
        fontSize: 16,
        color: "#0f172a",
        fontWeight: "500",
      }}
      dropdownStyle={{
        width: "80%",
        backgroundColor: "#ffffff",
        borderColor: "#cbd5e1",
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 4,
      }}
      dropdownTextStyle={{
        fontSize: 16,
        padding: 12,
        color: "#1e293b",
      }}
    />
  );
};

export default Dropdown;
