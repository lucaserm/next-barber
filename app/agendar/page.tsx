"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Scissors,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
} from "@/components/icons";
import {
  useServices,
  useBarbers,
  useCreateAppointment,
  useAppointments,
} from "@/lib/hooks/use-api";
import { availableTimeSlots } from "@/lib/mock-data";
import { toast } from "sonner";
import { enUS, ptBR } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

function BookingContent() {
  const t = useTranslations("booking");
  const locale = useLocale();
  const intlLocale = locale === "pt-br" ? "pt-BR" : "en-US";
  const dateFnsLocale = locale === "pt-br" ? ptBR : enUS;
  const searchParams = useSearchParams();
  const preSelectedService = searchParams.get("service");

  // React Query hooks
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: barbers = [], isLoading: loadingBarbers } = useBarbers();
  const createAppointment = useCreateAppointment();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(
    preSelectedService || "",
  );
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [clientData, setClientData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isComplete, setIsComplete] = useState(false);

  // Query para buscar agendamentos da data/barbeiro selecionado
  const { data: existingAppointments = [] } = useAppointments(
    selectedDate && selectedBarber
      ? {
          date: selectedDate.toISOString().split("T")[0],
          barberId: selectedBarber,
        }
      : undefined,
  );

  const activeServices = services.filter((s: any) => s.active);
  const activeBarbers = barbers.filter((b: any) => b.active);

  const selectedServiceData = activeServices.find(
    (s: any) => s.id === selectedService,
  );
  const selectedBarberData = activeBarbers.find(
    (b: any) => b.id === selectedBarber,
  );

  // Filtra horários já ocupados
  const getAvailableSlots = () => {
    if (!selectedDate || !selectedBarber) return availableTimeSlots;

    const bookedTimes = existingAppointments
      .filter((a: any) => a.status !== "CANCELLED")
      .map((a: any) => a.time);

    return availableTimeSlots.filter((time) => !bookedTimes.includes(time));
  };

  const availableSlots = getAvailableSlots();

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedService !== "";
      case 2:
        return selectedBarber !== "";
      case 3:
        return selectedDate !== undefined && selectedTime !== "";
      case 4:
        return clientData.name && clientData.phone;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!selectedServiceData || !selectedBarberData || !selectedDate) return;

    createAppointment.mutate(
      {
        clientName: clientData.name,
        clientPhone: clientData.phone,
        clientEmail: clientData.email,
        barberId: selectedBarber,
        serviceId: selectedService,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        status: "PENDING",
      },
      {
        onSuccess: () => {
          setIsComplete(true);
          toast.success(t("toastSuccess"));
        },
        onError: (error) => {
          toast.error(t("toastError", { message: error.message }));
        },
      },
    );
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{t("confirmed.title")}</CardTitle>
            <CardDescription>
              {t("confirmed.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-secondary/50 rounded-lg p-4 text-left space-y-2">
              <p>
                <strong>{t("confirmed.service")}</strong> {selectedServiceData?.name}
              </p>
              <p>
                <strong>{t("confirmed.professional")}</strong> {selectedBarberData?.name}
              </p>
              <p>
                <strong>{t("confirmed.date")}</strong>{" "}
                {selectedDate?.toLocaleDateString(intlLocale)}
              </p>
              <p>
                <strong>{t("confirmed.time")}</strong> {selectedTime}
              </p>
              <p>
                <strong>{t("confirmed.value")}</strong> R$ {selectedServiceData?.price}
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/">{t("confirmed.backHome")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loadingServices || loadingBarbers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Scissors className="w-6 h-6 text-primary" />
              <span className="font-serif text-xl font-bold">Elite67</span>
            </Link>
            <div className="text-sm text-muted-foreground">
              {t("stepCounter", { step })}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex">
            {[
              t("steps.service"),
              t("steps.professional"),
              t("steps.dateTime"),
              t("steps.data"),
            ].map((label, index) => (
                <div
                  key={label}
                  className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
                    index + 1 === step
                      ? "border-primary text-primary"
                      : index + 1 < step
                        ? "border-primary/50 text-muted-foreground"
                        : "border-transparent text-muted-foreground"
                  }`}
                >
                  {label}
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Serviço */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{t("step1.title")}</h1>
                <p className="text-muted-foreground">
                  {t("step1.subtitle")}
                </p>
              </div>

              <RadioGroup
                value={selectedService}
                onValueChange={setSelectedService}
              >
                <div className="grid gap-4">
                  {activeServices.map((service: any) => (
                    <Label
                      key={service.id}
                      htmlFor={service.id}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedService === service.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={service.id} id={service.id} />
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {service.duration} min
                          </div>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        R$ {service.price}
                      </span>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Profissional */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {t("step2.title")}
                </h1>
                <p className="text-muted-foreground">
                  {t("step2.subtitle")}
                </p>
              </div>

              <RadioGroup
                value={selectedBarber}
                onValueChange={setSelectedBarber}
              >
                <div className="grid gap-4">
                  {activeBarbers.map((barber: any) => (
                    <Label
                      key={barber.id}
                      htmlFor={`barber-${barber.id}`}
                      className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedBarber === barber.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem
                        value={barber.id}
                        id={`barber-${barber.id}`}
                      />
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={barber.avatar || "/placeholder.svg"}
                          alt={barber.name}
                        />
                        <AvatarFallback>
                          {barber.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{barber.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {barber.specialties.map((s: string) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="text-xs"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Data e Hora */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {t("step3.title")}
                </h1>
                <p className="text-muted-foreground">
                  {t("step3.subtitle")}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t("step3.dateLabel")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTime("");
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today || date.getDay() === 0;
                      }}
                      locale={dateFnsLocale}
                      className="rounded-md"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t("step3.timeLabel")}</CardTitle>
                    <CardDescription>
                      {selectedDate
                        ? t("step3.availableFor", {
                            date: selectedDate.toLocaleDateString(intlLocale),
                          })
                        : t("step3.selectDateFirst")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedDate ? (
                      availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setSelectedTime(time)}
                              className="text-sm"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          {t("step3.noSlots")}
                        </p>
                      )
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        {t("step3.selectDateToSeeSlots")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 4: Dados do Cliente */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{t("step4.title")}</h1>
                <p className="text-muted-foreground">
                  {t("step4.subtitle")}
                </p>
              </div>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("step4.nameLabel")}</Label>
                    <Input
                      id="name"
                      placeholder={t("step4.namePlaceholder")}
                      value={clientData.name}
                      onChange={(e) =>
                        setClientData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("step4.phoneLabel")}</Label>
                    <Input
                      id="phone"
                      placeholder={t("step4.phonePlaceholder")}
                      value={clientData.phone}
                      onChange={(e) =>
                        setClientData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("step4.emailLabel")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("step4.emailPlaceholder")}
                      value={clientData.email}
                      onChange={(e) =>
                        setClientData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Resumo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {t("step4.summaryTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("step4.service")}</span>
                    <span>{selectedServiceData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("step4.professional")}</span>
                    <span>{selectedBarberData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("step4.date")}</span>
                    <span>{selectedDate?.toLocaleDateString(intlLocale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("step4.time")}</span>
                    <span>{selectedTime}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-base">
                    <span>{t("step4.total")}</span>
                    <span className="text-primary">
                      R$ {selectedServiceData?.price}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t("nav.back")}
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
              >
                {t("nav.continue")}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || createAppointment.isPending}
              >
                {createAppointment.isPending
                  ? t("nav.booking")
                  : t("nav.confirm")}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BookingPage() {
  const t = useTranslations("booking");
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          {t("loadingPage")}
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
