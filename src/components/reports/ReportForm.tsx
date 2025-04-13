
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { FileUpload, Upload } from "lucide-react";
import { useState } from "react";

const reportFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters." })
    .max(100, { message: "Title must not exceed 100 characters." }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters." }),
  severity: z.enum(["critical", "high", "medium", "low", "info"], {
    required_error: "Please select a severity level.",
  }),
  category: z.enum(
    ["injection", "authentication", "xss", "authorization", "configuration", "other"],
    {
      required_error: "Please select a vulnerability category.",
    }
  ),
  steps: z
    .string()
    .min(20, { message: "Reproduction steps must be at least 20 characters." }),
  impact: z
    .string()
    .min(10, { message: "Impact must be at least 10 characters." }),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

const defaultValues: Partial<ReportFormValues> = {
  title: "",
  description: "",
  severity: "medium",
  category: "other",
  steps: "",
  impact: "",
};

const ReportForm = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = (data: ReportFormValues) => {
    toast({
      title: "Report submitted successfully",
      description: "Your security report has been submitted and will be reviewed.",
    });
    console.log(data, files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Security vulnerability title" {...field} />
                </FormControl>
                <FormDescription>
                  A clear and concise title for the security issue.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="injection">Injection</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                      <SelectItem value="xss">XSS</SelectItem>
                      <SelectItem value="authorization">Authorization</SelectItem>
                      <SelectItem value="configuration">Configuration</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of the security issue"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Explain the vulnerability in detail. Include all relevant information.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="steps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Steps to Reproduce</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Step by step instructions to reproduce the issue"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide clear steps that allow the security team to reproduce the issue.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="impact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potential Impact</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the potential impact of this vulnerability"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Explain how this vulnerability could affect users or the system.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <FormLabel>Attachments</FormLabel>
            <div className="mt-2">
              <label
                htmlFor="file-upload"
                className="flex justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-secondary transition-colors"
              >
                <div className="space-y-1 text-center">
                  <FileUpload className="h-6 w-6 text-muted-foreground mx-auto" />
                  <div className="text-sm text-muted-foreground">
                    Drag & drop files here, or click to select files
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, PDF, ZIP up to 10MB
                  </p>
                </div>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Uploaded Files</h4>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-md text-sm"
                  >
                    <div className="flex items-center">
                      <Upload className="h-4 w-4 mr-2 text-secondary" />
                      <span className="truncate max-w-[200px]">{file.name}</span>
                      <span className="ml-2 text-muted-foreground">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit">Submit Report</Button>
        </div>
      </form>
    </Form>
  );
};

export default ReportForm;
