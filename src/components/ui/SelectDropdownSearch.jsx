import { useState } from "react";
import { Combobox, Input, InputBase, useCombobox } from "@mantine/core";

export const SelectDropdownSearch = ({
  data,
  value,
  description,
  setValue,
  placeholder,
  size = "xl",
  radius = "xl",
}) => {
  const [search, setSearch] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch("");
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const options = data
    .filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
    .map((item) => (
      <Combobox.Option value={item} key={item}>
        {item}
      </Combobox.Option>
    ));

  return (
    <Combobox
      size={size}
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          label={description}
          component="button"
          size={size}
          radius={radius}
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
        >
          {value || <Input.Placeholder>{description}</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          size={size}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          placeholder={placeholder}
        />
        <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
          {options.length === 0 ? (
            <Combobox.Empty>Không tìm thấy</Combobox.Empty>
          ) : (
            options
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
