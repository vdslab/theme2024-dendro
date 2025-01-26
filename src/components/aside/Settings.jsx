import {
  Box,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useContext, useMemo } from "react";
import {
  materialFlowDataNameMap,
  peopleFlowDataNameMap,
} from "../../constants/flowData";
import { prefectureIdToName } from "../../constants/prefecture";
import { DataContext } from "../../context/DataContext/DataContext";
import {
  isNotNullOrUndefined,
  isNullOrUndefined,
} from "../../functions/nullOrUndefined";
import { sum } from "../../functions/sum";

export const Settings = () => {
  const {
    peopleFlowData,
    materialFlowData,
    years,
    selectedYear,
    setSelectedYear,
    selectedPrefecture,
    setSelectedPrefecture,
    selectedType,
    setSelectedType,
    selectedDataType,
    setSelectedDataType,
  } = useContext(DataContext);
  // const [direction, setDirection] = useState("in");
  const unit = useMemo(
    () => (selectedDataType === "people" ? "千人" : "トン"),
    [selectedDataType]
  );
  const prefectureDisplayData = useMemo(() => {
    try {
      if (selectedDataType === "people") {
        const obj = {};
        Object.entries(peopleFlowData[selectedType][selectedYear][48]).forEach(
          ([key, value]) => {
            const currentPrefValue =
              peopleFlowData[selectedType][selectedYear][key][key];
            obj[key] = Math.floor(value - currentPrefValue);
          }
        );
        return obj;
      } else {
        const obj = {};
        Object.entries(
          materialFlowData[selectedType][selectedYear][48]
        ).forEach(([key, value]) => {
          const currentPrefValue =
            materialFlowData[selectedType][selectedYear][key][key];
          obj[key] = Math.floor(value - currentPrefValue);
        });
        return obj;
      }
    } catch {
      return {};
    }
  }, [
    peopleFlowData,
    materialFlowData,
    selectedDataType,
    selectedType,
    selectedYear,
  ]);

  const typeDisplayData = useMemo(() => {
    try {
      if (selectedDataType === "people") {
        const obj = {};
        Object.entries(peopleFlowData).forEach(([key, value]) => {
          obj[key] = Math.floor(
            sum(Object.values(value[selectedYear][selectedPrefecture])) -
              value[selectedYear][selectedPrefecture][selectedPrefecture]
          );
        });

        return obj;
      } else {
        const obj = {};
        Object.entries(materialFlowData).forEach(([key, value]) => {
          obj[key] = Math.floor(
            value[selectedYear][selectedPrefecture][48] -
              value[selectedYear][selectedPrefecture][selectedPrefecture]
          );
        });

        return obj;
      }
    } catch {
      return {};
    }
  }, [
    peopleFlowData,
    materialFlowData,
    selectedDataType,
    selectedYear,
    selectedPrefecture,
  ]);

  const yearDisplayData = useMemo(() => {
    try {
      if (selectedDataType === "people") {
        const obj = {};
        Object.entries(peopleFlowData[selectedType]).forEach(([key, value]) => {
          obj[key] = Math.floor(
            sum(Object.values(value[selectedPrefecture])) -
              value[selectedPrefecture][selectedPrefecture]
          );
        });

        return obj;
      } else {
        const obj = {};
        Object.entries(materialFlowData[selectedType]).forEach(
          ([key, value]) => {
            obj[key] = Math.floor(
              sum(Object.values(value[selectedPrefecture])) -
                value[selectedPrefecture][selectedPrefecture]
            );
          }
        );

        return obj;
      }
    } catch {
      return {};
    }
  }, [
    peopleFlowData,
    materialFlowData,
    selectedDataType,
    selectedPrefecture,
    selectedType,
  ]);

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography variant="h5">Settings</Typography>

      <Box display="flex" alignItems="center">
        <Typography variant="body">選択した都道府県:</Typography>
        <Select
          size="small"
          value={
            isNotNullOrUndefined(selectedPrefecture) ? selectedPrefecture : ""
          }
          onChange={(e) => setSelectedPrefecture(Number(e.target.value))}
          sx={{ width: "50%" }}
          MenuProps={{
            sx: { maxHeight: 480 },
          }}
          displayEmpty
          renderValue={(selected) =>
            selected ? prefectureIdToName[selected] : "未選択"
          }
        >
          {Object.entries(prefectureIdToName).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              <Typography variant="body1" marginRight={1}>
                {value}
              </Typography>
              <Typography variant="caption">
                {`総量: ${
                  prefectureDisplayData[key]?.toLocaleString() ?? ""
                } ${unit}`}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box display="flex" alignItems="center">
        <Typography variant="body">
          {selectedDataType === "people" ? "移動手段：" : "輸送手段："}
        </Typography>
        <Select
          size="small"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          sx={{ width: "50%" }}
          MenuProps={{
            sx: { maxHeight: 480 },
          }}
          renderValue={(selected) =>
            selectedDataType === "people"
              ? peopleFlowDataNameMap[selected].displayName
              : materialFlowDataNameMap[selected].displayName
          }
        >
          {Object.values(
            selectedDataType === "people"
              ? peopleFlowDataNameMap
              : materialFlowDataNameMap
          ).map((flowData) => (
            <MenuItem key={flowData.id} value={flowData.id}>
              <Typography variant="body1" marginRight={1}>
                {flowData.displayName}
              </Typography>
              <Typography variant="caption">
                {`総量: ${
                  typeDisplayData[flowData.id]?.toLocaleString() ?? ""
                } ${unit}`}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box display="flex" alignItems="center">
        <Typography variant="body">選択年：</Typography>
        <Select
          size="small"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          sx={{ width: "50%" }}
          MenuProps={{
            sx: { maxHeight: 480 },
          }}
          renderValue={(selected) => selected}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              <Typography variant="body1" marginRight={1}>
                {year}
              </Typography>
              <Typography variant="caption">
                {`総量: ${
                  yearDisplayData[year]?.toLocaleString() ?? ""
                } ${unit}`}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Box>
      {/* <Box display="flex" alignItems="center">
        <Typography variant="body">方向：</Typography>
        <ToggleButtonGroup
          value={direction}
          onChange={(_, value) => setDirection(value)}
          exclusive
          sx={{ marginLeft: 1 }}
        >
          <ToggleButton size="small" value="in">
            入る
          </ToggleButton>
          <ToggleButton size="small" value="out">
            出る
          </ToggleButton>
        </ToggleButtonGroup>
      </Box> */}
      <Box display="flex" alignItems="center">
        <Typography variant="body">種類：</Typography>
        <ToggleButtonGroup
          value={selectedDataType}
          onChange={(_, value) => {
            if (isNullOrUndefined(value)) return;
            setSelectedDataType(value);
            setSelectedType(value === "people" ? "total" : "totalAll");
          }}
          exclusive
          sx={{ marginLeft: 1 }}
        >
          <ToggleButton size="small" value="material">
            物流
          </ToggleButton>
          <ToggleButton size="small" value="people">
            人流
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};
