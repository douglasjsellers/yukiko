class TestApiController < ApplicationController

  def index
    @requests = ApiRequest.all
  end

  def create
    request = ApiRequest.new
    request.request = params.to_json
    request.save
    render :text => ''
  end
end
