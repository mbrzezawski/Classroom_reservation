import { FormProvider, useForm, Controller } from "react-hook-form";
import InputTextBox from "../ui/input-textbox";
import { useState } from "react";
import { useRoomService } from "../../hooks/useRoomService";
import { useSoftwareService } from "../../hooks/useSoftwareService";
import { useEquipmentService } from "../../hooks/useEquipmentService";
import { useSoftware } from "../../hooks/use-room-features.ts";
import { useEquipment } from "../../hooks/use-room-features.ts";
import showToast from "../../hooks/show-toast.ts";

type NewRoomFormValues = {
  name: string;
  capacity: number;
  location: string;
  softwareIds: string[];
  customSoftware?: string;
  equipmentIds: string[];
  customEquipment?: string;
};

const AddNewRoomForm = () => {
  const software = useSoftware();
  const equipment = useEquipment();

  const methods = useForm<NewRoomFormValues>({
    defaultValues: {
      name: "",
      capacity: 0,
      location: "",
      softwareIds: [],
      customSoftware: "",
      equipmentIds: [],
      customEquipment: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = methods;

  const [showCustomSoftware, setShowCustomSoftware] = useState(false);
  const [showCustomEquipment, setShowCustomEquipment] = useState(false);

  const { createRoom } = useRoomService();
  const { createSoftware } = useSoftwareService();
  const { createEquipment } = useEquipmentService();

  const onSubmit = async (formData: any) => {
    try {
      const softwareIds: string[] = formData.softwareIds;

      if (formData.customSoftware?.trim()) {
        const names = formData.customSoftware
          .split(",")
          .map((name) => name.trim())
          .filter((name) => name.length > 0);

        for (const name of names) {
          const created = await createSoftware.mutateAsync(name);
          softwareIds.push(created.id);
        }
      }

      const equipmentIds: string[] = formData.equipmentIds;

      if (formData.customEquipment?.trim()) {
        const names = formData.customEquipment
          .split(",")
          .map((name) => name.trim())
          .filter((name) => name.length > 0);

        for (const name of names) {
          const created = await createEquipment.mutateAsync(name);
          equipmentIds.push(created.id);
        }
      }

      const newRoom = {
        name: formData.name,
        capacity: formData.capacity,
        location: formData.location,
        softwareIds,
        equipmentIds,
      };

      await createRoom.mutateAsync(newRoom);

      showToast("Sala stworzona!", { variant: "success" });
      methods.reset();
    } catch (error) {
      showToast("Tworzenie sali nie powiodło się.", {
        variant: "destructive",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-base-200 border px-6 py-12 gap-[40px] rounded-[8px] w-full max-w-lg mx-auto min-h-[700px]"
      >
        <h2 className="text-[32px] text-center font-semibold">Add New Room</h2>

        <InputTextBox
          icon={undefined}
          label="Nazwa sali"
          placeholder="Wprowadź nazwę sali, np. 4.21"
          error={errors.name?.message}
          {...register("name", { required: "Nazwa sali jest wymagana" })}
        />

        <InputTextBox
          icon={undefined}
          label="Pojemność"
          type="number"
          placeholder="Wprowadź pojemność"
          error={errors.capacity?.message}
          {...register("capacity", {
            required: "Pojemność jest wymagana",
            min: {
              value: 1,
              message: "Pojemność musi być przynajmniej równa 1",
            },
          })}
        />

        <InputTextBox
          icon={undefined}
          label="Lokacja"
          placeholder="Wprowadź lokację, np. D17"
          error={errors.location?.message}
          {...register("location", { required: "Lokacja wymagana" })}
        />

        {/* Software Checklist */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Software</label>
          <Controller
            control={control}
            name="softwareIds"
            render={({ field }) => (
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto p-2 border rounded-md">
                {software.map((item) => (
                  <label key={item.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={item.value}
                      checked={field.value.includes(item.value)}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (e.target.checked) {
                          field.onChange([...field.value, value]);
                        } else {
                          field.onChange(
                            field.value.filter((v) => v !== value)
                          );
                        }
                      }}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          />

          <label className="text-sm flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              onChange={(e) => setShowCustomSoftware(e.target.checked)}
              checked={showCustomSoftware}
            />
            Nowe oprogramowanie
          </label>
          {showCustomSoftware && (
            <InputTextBox
              icon={undefined}
              label="Nowe oprogramowanie"
              placeholder="Wprowadź przedzielając przecinkiem np.: Wireshark,Zoom,..."
              {...register("customSoftware")}
            />
          )}
        </div>

        {/* Equipment Checklist */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Equipment</label>
          <Controller
            control={control}
            name="equipmentIds"
            render={({ field }) => (
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto p-2 border rounded-md">
                {equipment.map((item) => (
                  <label key={item.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={item.value}
                      checked={field.value.includes(item.value)}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (e.target.checked) {
                          field.onChange([...field.value, value]);
                        } else {
                          field.onChange(
                            field.value.filter((v) => v !== value)
                          );
                        }
                      }}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          />
          <label className="text-sm flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              onChange={(e) => setShowCustomEquipment(e.target.checked)}
              checked={showCustomEquipment}
            />
            Nowe wyposażenie
          </label>
          {showCustomEquipment && (
            <InputTextBox
              label="Nowe wyposażenie"
              placeholder="Wprowadź przedzielając przecinkiem np.: Projektor,Mikrofon,..."
              {...register("customEquipment")}
            />
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="btn w-[274px] py-2 border rounded-[12px]"
          >
            Dodaj pokój
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddNewRoomForm;
