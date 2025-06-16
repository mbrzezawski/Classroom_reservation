import type { FC } from "react";
import { useFormContext } from "react-hook-form";
import { useEquipment, useSoftware } from "../../../hooks/use-room-features";

const FeaturesPicker: FC = () => {
  const { register } = useFormContext();
  const roomEquipment = useEquipment();
  const roomSoftware = useSoftware();
  return (
    <div className="flex flex-row justify-center gap-4 w-full">
      <fieldset className="fieldset bg-base-100 border-base-300 rounded-box border p-4">
        <legend className="fieldset-legend">Wyposażenie</legend>
        {roomEquipment.map((feature) => (
          <label className="label " key={feature.value}>
            <input
              type="checkbox"
              className="checkbox"
              value={feature.value}
              {...register("equipment")}
            />
            {feature.label}
          </label>
        ))}
      </fieldset>
      <fieldset className="fieldset bg-base-100 border-base-300 rounded-box border p-4">
        <legend className="fieldset-legend">Oprogramowanie</legend>
        {roomSoftware.map((feature) => (
          <label className="label" key={feature.value}>
            <input
              type="checkbox"
              className="checkbox"
              value={feature.value}
              {...register("software")}
            />
            {feature.label}
          </label>
        ))}
      </fieldset>
    </div>
  );
};

export default FeaturesPicker;
