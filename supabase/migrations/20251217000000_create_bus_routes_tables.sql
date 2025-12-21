-- Create bus_stops table
CREATE TABLE IF NOT EXISTS public.bus_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_gu TEXT, -- Gujarati name
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(name)
);

-- Create bus_routes table
CREATE TABLE IF NOT EXISTS public.bus_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_gu TEXT, -- Gujarati name
  start_point TEXT NOT NULL,
  end_point TEXT NOT NULL,
  distance NUMERIC, -- in km
  estimated_time INTEGER, -- in minutes
  first_bus TIME,
  last_bus TIME,
  frequency TEXT,
  fare NUMERIC,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create junction table for route stops (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.route_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES public.bus_routes(id) ON DELETE CASCADE,
  stop_id UUID NOT NULL REFERENCES public.bus_stops(id) ON DELETE CASCADE,
  stop_order INTEGER NOT NULL, -- Order of stop in the route
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(route_id, stop_id, stop_order)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bus_routes_route_number ON public.bus_routes(route_number);
CREATE INDEX IF NOT EXISTS idx_bus_stops_name ON public.bus_stops(name);
CREATE INDEX IF NOT EXISTS idx_route_stops_route_id ON public.route_stops(route_id);
CREATE INDEX IF NOT EXISTS idx_route_stops_stop_id ON public.route_stops(stop_id);

-- Enable RLS on all tables
ALTER TABLE public.bus_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public read access to bus routes and stops
CREATE POLICY "Anyone can view bus stops"
ON public.bus_stops FOR SELECT
USING (true);

CREATE POLICY "Anyone can view bus routes"
ON public.bus_routes FOR SELECT
USING (true);

CREATE POLICY "Anyone can view route stops"
ON public.route_stops FOR SELECT
USING (true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_bus_routes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for bus_routes updates
CREATE TRIGGER update_bus_routes_updated_at
  BEFORE UPDATE ON public.bus_routes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_bus_routes_updated_at();

-- Trigger for bus_stops updates
CREATE TRIGGER update_bus_stops_updated_at
  BEFORE UPDATE ON public.bus_stops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_bus_routes_updated_at();

