declare module '@storybook/react' {
  export interface Meta<T = any> {
    title: string;
    component: T;
    decorators?: Array<(Story: any) => JSX.Element>;
    parameters?: Record<string, any>;
    tags?: string[];
  }

  export interface StoryObj<T = any> {
    args?: Record<string, any>;
    parameters?: Record<string, any>;
    play?: (context: { canvasElement: HTMLElement; args: Record<string, any> }) => Promise<void> | void;
  }
}

declare module '@storybook/test' {
  export function within(element: HTMLElement): {
    getByRole: (role: string, options?: any) => HTMLElement;
    getByText: (text: string | RegExp) => HTMLElement;
    getByPlaceholderText: (text: string | RegExp) => HTMLElement;
    queryByRole: (role: string, options?: any) => HTMLElement | null;
    queryByText: (text: string | RegExp) => HTMLElement | null;
    queryAllByRole: (role: string, options?: any) => HTMLElement[];
    queryByPlaceholderText: (text: string | RegExp) => HTMLElement | null;
    getByLabelText: (text: string | RegExp) => HTMLElement;
  };

  export const userEvent: {
    click: (element: HTMLElement) => Promise<void>;
    type: (element: HTMLElement, text: string) => Promise<void>;
    clear: (element: HTMLElement) => Promise<void>;
    keyboard: (keys: string) => Promise<void>;
  };

  export const expect: {
    (value: any): {
      toBeInTheDocument: () => void;
      toHaveBeenCalled: () => void;
      toHaveStyle: (style: any) => void;
      not: {
        toBeInTheDocument: () => void;
      };
    };
    stringContaining: (str: string) => any;
  };

  export function fn<T extends (...args: any[]) => any>(): T;
}
